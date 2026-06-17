import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  tokens: {
    type: Number,
    default: 0
  },
  model: {
    type: String,
    default: 'claude-sonnet-4'
  },
  metadata: {
    processingTime: Number,
    error: String,
    feedback: {
      type: String,
      enum: ['positive', 'negative', null],
      default: null
    }
  }
}, {
  timestamps: true
});

// Índice compuesto para obtener mensajes de una conversación
messageSchema.index({ conversationId: 1, createdAt: 1 });

// Método estático para obtener contexto reciente
messageSchema.statics.getRecentContext = async function(conversationId, limit = 20) {
  return await this.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('role content')
    .lean();
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
