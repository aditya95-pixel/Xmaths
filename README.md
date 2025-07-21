# Project Documentation

## Why did we use MongoDB for Xmaths?

1. **Flexible Schema** : Future features might introduce new types of messages.  With MongoDB, we can easily add new fields to our messages array or even new top-level fields to Chat documents without requiring complex migrations that would be necessary in a relational database.

2. **Document Model (JSON-like Documents)** : Embedded Documents: The messages array within the Chat document is a perfect example of MongoDB's document model strength. All the messages for a specific chat are stored together in a single document. This reduces the number of queries needed to retrieve a full chat conversation, as you fetch one Chat document and get all its related messages, leading to faster read performance for chat history.

3. **Scalability (Horizontal Scaling)** : We can distribute our data across multiple servers (shards) as our data volume or traffic increases, allowing us to scale out gracefully without needing to upgrade to larger, more expensive single servers. This "scale-out" approach is generally more cost-effective and resilient than "scale-up."(vertical scaling)

4. **Performance for Read-Heavy Workloads**

## Database Models
