from asyncio import log
import pymongo 
import certifi

MONGODB_URI = "mongodb+srv://athena:athena2024@cluster-athena.zbkrm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-athena"
DATABASE_NAME = "ATHENA"
COLLECTION = "articles"

class MongoDBUtils:
    def __init__(self):
        self.client = pymongo.MongoClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),
        )
        self.db = self.client[DATABASE_NAME]
        self.collection = self.db[COLLECTION]

    # Insert article
    def insert_article(self, article):
        result = self.collection.insert_one(article)
        return result.inserted_id

    # Insert multiple articles
    def insert_articles(self, articles):
        result = self.collection.insert_many(articles)
        return len(result.inserted_ids)

    # Update article
    def update_article(self, query, update_data):
        result = self.collection.update_one(query, {'$set': update_data})
        return result

    # Delete article
    def delete_article(self, query):
        result = self.collection.delete_one(query)
        return result.deleted_count

    # Find articles
    def find_articles(self, query=None):
        log.logger.info("Query: ", query)
        if query is None:
            query = {}
        return list(self.collection.find(query))
    
    # Delete all articles
    def delete_articles(self, query=None):
        result = self.collection.delete_many(query)
        return result.deleted_count
    
    # Search articles
    def advanced_search(self,query, limit=5):
        log.logger.info("Query: ", query)
        pipeline = [
        {
                "$search": {
                "index": "default", 
                "compound": {
                    "should": [
                        {
                            "text": {
                                "query": query,
                                "path": "title"
                            }
                        },
                        {
                            "text": {
                                "query": query,
                                "path": "content"
                            }
                        }
                    ]
                }
            }
        },
        {
            '$project': {
            'title': 1,
            'content': 1,
            'score': {'$meta': 'searchScore'},
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "title": {"$first": "$title"},
                "content": {"$first": "$content"},
                "score": {"$first": "$score"}
            }
        },
        {
            "$sort": {"score": {"$meta": "textScore"}}, 
        },
        {
            "$limit": limit
        }
        ]
        results = list(self.collection.aggregate(pipeline))
        results.sort(key=lambda x: x.get('score',0), reverse=True)
        return results