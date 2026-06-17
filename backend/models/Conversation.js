import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'Nueva conversación',
    trim: true,
    maxlength: 200
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 100
  },
  messageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    userCarrera: String,
    firstQuestion: String,
    topics: [String]
  }
}, {
  timestamps: true
});

// Índice compuesto para búsquedas rápidas
conversationSchema.index({ userId: 1, isActive: 1, lastMessageAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
