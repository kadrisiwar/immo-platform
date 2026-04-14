"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useConversations,
  useConversation,
  useEnvoyerMessage,
} from "@/hooks/use-messagerie";
import { cn } from "@/lib/utils";

export default function ProprietaireMessagesPage() {
  const { data: conversations = [], isLoading } = useConversations();
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { data: activeConv } = useConversation(activeConvId || 0);
  const envoyer = useEnvoyerMessage();

  // user id من localStorage token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  let myId = 0;
  if (token) {
    try {
      myId = JSON.parse(atob(token.split(".")[1])).user_id;
    } catch {}
  }

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvId) return;
    envoyer.mutate({ convId: activeConvId, contenu: newMessage });
    setNewMessage("");
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Échangez avec vos locataires
        </p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Aucune conversation pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[600px]">
          {/* Liste conversations */}
          <Card className="col-span-1 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors border-b",
                    activeConvId === conv.id && "bg-accent"
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs">
                      {conv.locataire_nom.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate">
                        {conv.locataire_nom}
                      </p>
                      {conv.non_lus > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0"
                        >
                          {conv.non_lus}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.annonce_titre}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Zone messages */}
          <Card className="col-span-2 flex flex-col overflow-hidden">
            {!activeConv ? (
              <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                Sélectionnez une conversation
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {activeConv.locataire_nom.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">
                        {activeConv.locataire_nom}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {activeConv.annonce_titre}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.expediteur === myId
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs rounded-lg px-3 py-2 text-sm",
                          msg.expediteur === myId
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <p>{msg.contenu}</p>
                        <p className={cn("text-xs mt-1 opacity-70")}>
                          {new Date(msg.created_at).toLocaleTimeString(
                            "fr-TN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="border-t p-3 flex gap-2">
                  <Input
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={envoyer.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
