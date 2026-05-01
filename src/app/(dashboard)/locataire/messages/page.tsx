"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useConversations, useConversation, useEnvoyerMessage } from "@/hooks/use-messagerie";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LocataireMessagesPage() {
  const { data: conversations = [], isLoading } = useConversations();
  const [activeConvId, setActiveConvId]         = useState<number | null>(null);
  const [newMessage, setNewMessage]             = useState("");
  const { data: activeConv }                    = useConversation(activeConvId || 0);
  const envoyer   = useEnvoyerMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  useEffect(() => {
    if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations]);

  let myId = 0;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      try { myId = JSON.parse(atob(token.split(".")[1])).user_id; } catch {}
    }
  }

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvId) return;
    envoyer.mutate({ convId: activeConvId, contenu: newMessage });
    setNewMessage("");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  );

  if (conversations.length === 0) return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Aucune conversation pour le moment</p>
          <p className="text-sm mt-1">
            Contactez un propriétaire depuis une annonce
          </p>
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/annonces">
              <Plus className="mr-2 h-4 w-4" /> Voir les annonces
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">Échangez avec les propriétaires</p>
      </div>

      <div className="grid grid-cols-3 gap-4" style={{ height: "600px" }}>

        {/* Liste conversations */}
        <Card className="col-span-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 shrink-0">
            <CardTitle className="text-sm">
              Conversations ({conversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
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
                    {conv.proprietaire_nom.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-1">
                    <p className="text-sm font-medium truncate">{conv.proprietaire_nom}</p>
                    {conv.non_lus > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">
                        {conv.non_lus}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.annonce_titre}</p>
                  {conv.messages && conv.messages.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate opacity-70">
                      {conv.messages[conv.messages.length - 1].contenu}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Zone messages */}
        <Card className="col-span-2 flex flex-col overflow-hidden">
          {!activeConv ? (
            <CardContent className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Sélectionnez une conversation</p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-3 border-b shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {activeConv.proprietaire_nom.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{activeConv.proprietaire_nom}</p>
                    <p className="text-xs text-muted-foreground">{activeConv.annonce_titre}</p>
                  </div>
                  {/* Indicateur real-time */}
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">En direct</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Commencez la conversation...
                  </div>
                ) : activeConv.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.expediteur === myId ? "justify-end" : "justify-start")}>
                    {msg.expediteur !== myId && (
                      <Avatar className="h-6 w-6 mr-2 mt-1 shrink-0">
                        <AvatarFallback className="text-[10px]">
                          {activeConv.proprietaire_nom.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      "max-w-xs rounded-2xl px-4 py-2 text-sm",
                      msg.expediteur === myId
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    )}>
                      <p>{msg.contenu}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {new Date(msg.created_at).toLocaleTimeString("fr-TN", {
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </CardContent>

              <div className="border-t p-3 flex gap-2 shrink-0">
                <Input
                  placeholder="Écrire un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={envoyer.isPending || !newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}