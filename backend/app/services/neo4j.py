import os
from neo4j import GraphDatabase, Session
from typing import Optional, List, Dict, Any
import json


class Neo4jClient:
    def __init__(self, uri: str, username: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(username, password))

    def close(self):
        self.driver.close()

    def create_task_node(self, task_data: Dict[str, Any]) -> str:
        """Create a Task node in Neo4j"""
        with self.driver.session() as session:
            result = session.run(
                """
                MERGE (t:Task {id: $id})
                SET t.text = $text,
                    t.project = $project,
                    t.tags = $tags,
                    t.contexts = $contexts,
                    t.confidence = $confidence,
                    t.source = $source,
                    t.created_at = $created_at,
                    t.ai_parsed = $ai_parsed,
                    t.status = 'active'
                RETURN t.id as id
                """,
                **task_data
            )
            return result.single()["id"] if result.single() else None

    def create_video_capture_node(self, video_data: Dict[str, Any]) -> str:
        """Create a VideoCapture node in Neo4j"""
        with self.driver.session() as session:
            result = session.run(
                """
                MERGE (v:VideoCapture {id: $id})
                SET v.youtube_url = $youtube_url,
                    v.video_id = $video_id,
                    v.title = $title,
                    v.channel = $channel,
                    v.transcript = $transcript,
                    v.summary = $summary,
                    v.extracted_tasks = $extracted_tasks,
                    v.captured_at = $captured_at,
                    v.source = $source,
                    v.exported_to_obsidian = $exported_to_obsidian
                RETURN v.id as id
                """,
                **video_data
            )
            return result.single()["id"] if result.single() else None

    def create_voice_memo_node(self, memo_data: Dict[str, Any]) -> str:
        """Create a VoiceMemoCapture node in Neo4j"""
        with self.driver.session() as session:
            result = session.run(
                """
                MERGE (m:VoiceMemoCapture {id: $id})
                SET m.transcript = $transcript,
                    m.extracted_tasks = $extracted_tasks,
                    m.extracted_tags = $extracted_tags,
                    m.extracted_contexts = $extracted_contexts,
                    m.captured_at = $captured_at,
                    m.source = $source,
                    m.duration_seconds = $duration_seconds,
                    m.exported_to_obsidian = $exported_to_obsidian
                RETURN m.id as id
                """,
                **memo_data
            )
            return result.single()["id"] if result.single() else None

    def get_node_by_id(self, node_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a node by ID from any type"""
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n) WHERE n.id = $id RETURN properties(n) as data",
                id=node_id
            )
            record = result.single()
            return record["data"] if record else None

    def query(self, cypher: str, **parameters) -> List[Dict[str, Any]]:
        """Execute a Cypher query and return results"""
        with self.driver.session() as session:
            result = session.run(cypher, **parameters)
            return [dict(record) for record in result]

    def health_check(self) -> bool:
        """Test Neo4j connection"""
        try:
            with self.driver.session() as session:
                session.run("RETURN 1")
            return True
        except Exception as e:
            print(f"Neo4j health check failed: {e}")
            return False


# Singleton instance
_neo4j_client: Optional[Neo4jClient] = None


def get_neo4j_client(uri: str = None, username: str = None, password: str = None) -> Neo4jClient:
    global _neo4j_client
    if _neo4j_client is None:
        uri = uri or os.getenv("NEO4J_URI", "bolt://localhost:7687")
        username = username or os.getenv("NEO4J_USERNAME", "neo4j")
        password = password or os.getenv("NEO4J_PASSWORD", "password")
        _neo4j_client = Neo4jClient(uri, username, password)
    return _neo4j_client


def close_neo4j_client():
    global _neo4j_client
    if _neo4j_client:
        _neo4j_client.close()
        _neo4j_client = None
