import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [500, 'Title cannot exceed 500 characters']
  },
  url: {
    type: String,
    required: [true, 'Story URL is required'],
    trim: true,
    unique: true
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [0, 'Points cannot be negative'],
    default: 0
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [50, 'Author name cannot exceed 50 characters']
  },
  postedAt: {
    type: String,
    required: [true, 'Posted date is required'],
    trim: true
  },
  hnId: {
    type: String,
    required: [true, 'HackerNews ID is required'],
    unique: true,
    trim: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

storySchema.index({ points: -1 });
storySchema.index({ hnId: 1 });
storySchema.index({ url: 1 });
storySchema.index({ scrapedAt: -1 });

export default mongoose.model('Story', storySchema);
