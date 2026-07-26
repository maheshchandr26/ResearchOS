import { useParams } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import ChatLayout from "@/components/chat/ChatLayout";

export default function ChatPage() {
  const { id } = useParams();

  if (!id) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Research Chat
            </h1>

            <p className="text-muted-foreground text-lg">
              Select a project from the Dashboard to start chatting with your documents.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ChatLayout
      projectId={Number(id)}
      onSourceClick={() => {}}
      />
    </Layout>
  );
}