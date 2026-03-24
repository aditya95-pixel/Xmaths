import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
    {
        category: { 
            type: String, 
            required: true, 
            enum: ['mathematics', 'data-structures', 'algorithms', 'machine-learning', 'deep-learning'],
            lowercase: true
        },
        topicName: { type: String, required: true },
        description: { type: String },
        links: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
                type: { type: String, enum: ['video', 'article', 'documentation', 'pdf'], default: 'article' }
            }
        ],
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Resource = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

export default Resource;