
const { ChatSession } = require('../models/Chat');
const { llm } = require('../config/langchain');
const { querySimilarChunks } = require('../config/vectorStore');

const createSession = async (req, res) => {
  try {
    const session = new ChatSession({
      userId: req.user._id,
      title: req.body.title || 'New Chat'
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat session' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    const session = await ChatSession.findOne({
      _id: sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Find relevant documents (already deduplicated + relevance-filtered)
    const relevantDocs = await querySimilarChunks(message, req.user._id);

    // Build context — label each chunk with its source file for traceability
    const context = relevantDocs.length > 0
      ? relevantDocs
          .map((doc, i) => `[Source ${i + 1}: ${doc.metadata.filename}]\n${doc.pageContent.trim()}`)
          .join('\n\n---\n\n')
      : '';

    const systemPrompt = context
      ? `You are DocuMind, a helpful AI assistant. Answer the user's question using ONLY the context below. 
If the answer is not in the context, say "I couldn't find relevant information in the uploaded documents."

Context:
${context}`
      : `You are DocuMind, a helpful AI assistant. No relevant document context was found for this question. 
Let the user know they should upload relevant documents first, or rephrase their question.`;

    // Prepare conversation history
    const conversationHistory = session.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await llm.invoke([
      ['system', systemPrompt],
      ...conversationHistory.map(msg => [msg.role === 'assistant' ? 'ai' : 'human', msg.content]),
      ['human', message]
    ]);

    console.log("Response :", response.content)
    // Save messages to session
    session.messages.push(
      {
        role: 'user',
        content: message
      },
      {
        role: 'assistant',
        content: response.content,
        sourceDocs: relevantDocs.map(doc => ({
          documentId: doc.metadata.documentId,
          relevanceScore: doc.score
        }))
      }
    );

    await session.save();



    res.json({
      message: response.content,
      sources: relevantDocs.map(doc => ({
        documentId: doc.metadata.documentId,
        filename: doc.metadata.filename,
        relevanceScore: doc.score
      }))
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
};

const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({
      _id: sessionId,
      userId: req.user._id
    }).populate('messages.sourceDocs.documentId', 'filename');

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat history' });
  }
};

// Delete a chat session
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOneAndDelete({ _id: sessionId, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    console.log("deleted")
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting chat session' });
  }
};

// Edit chat session title
const editSessionTitle = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const session = await ChatSession.findOneAndUpdate(
      { _id: sessionId, userId: req.user._id },
      { title },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error updating chat session title' });
  }
};
// Get all chat sessions for a user
const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })
      .select('_id title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat sessions' });
  }
};

module.exports = {
  createSession,
  sendMessage,
  getHistory,
  getSessions,
  deleteSession,
  editSessionTitle
};