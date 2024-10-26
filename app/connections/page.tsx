'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, Search, Send, Check, CheckCheck, X, Menu, Trash } from 'lucide-react';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface ConnectedUser {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  dob?: number;
  city?: string;
  role?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

interface Connection {
  id: string;
  connectedAt: string;
  connectedUser: ConnectedUser;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  subscriptionPlanId?: string;
  subscriptionExpiry?: string;
}

export default function ConnectionsPage() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<ConnectedUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch user and connections
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: FirebaseUser | null) => {
      if (currentUser) {
        try {
          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'uid': currentUser.uid,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch profile data');

          const data: UserProfile = await response.json();
          setUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } else {
        setError("Please sign in to view your connections");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      const response = await fetch(`/api/connections/connected?userId=${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch connections');
      }

      const data: { connections: Connection[] } = await response.json();
      setConnections(data.connections);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch connections');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load connections",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (connectionId: string) => {
    try {
      const response = await fetch('/api/connections/connected', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }),
      });

      if (!response.ok) {
        const data: { error: string } = await response.json();
        throw new Error(data.error || 'Failed to remove connection');
      }

      setConnections(connections.filter(connection => connection.id !== connectionId));

      toast({
        title: "Success",
        description: "Connection removed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to remove connection',
      });
    }
  };

  const fetchMessages = async (recipientId: string, senderId: string) => {
    try {
      const response = await fetch(`/api/messages/${recipientId}`, {
        method: 'GET',
        headers: {
          'senderId': senderId,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
  
      const data: Message[] = await response.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to load messages',
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection || !user) return;
  
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          recipientId: selectedConnection.id,
          content: newMessage,
        }),
      });
  
      if (!response.ok) throw new Error('Failed to send message');
  
      const message: Message = await response.json();
      setMessages([...messages, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to send message',
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedConnection && user?.id) {
      fetchMessages(selectedConnection.id, user.id);
    }
  }, [selectedConnection, user]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleConnectionSelect = (connection: ConnectedUser) => {
    setSelectedConnection(connection);
    // On mobile, auto-hide sidebar when selecting a connection
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const filteredConnections = connections.filter(connection => 
    connection.connectedUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasValidSubscription = (): boolean => {
    if (!user?.subscriptionPlanId) return false;
    if (!user?.subscriptionExpiry) return false;
    
    const expiryDate = new Date(user.subscriptionExpiry);
    const currentDate = new Date();
    
    return expiryDate > currentDate;
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading connections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

    // Show subscription message if user doesn't have a valid subscription
    if (!loading && !hasValidSubscription()) {
      return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Subscription Required</h2>
            <p className="text-gray-600 mb-6">
              Please subscribe to view profiles and connect with potential matches.
            </p>
            <button 
              onClick={() => router.push('/plans')}
              className="bg-primaryPink hover:bg-opacity-80 text-white px-6 py-3 rounded-xl"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
      );
    }

  return (
    <div>
      <Navbar/>
    <div className="h-screen flex bg-gray-100 relative">
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden absolute top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Left Sidebar - Connections List */}
      <div 
        className={`${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 fixed md:relative w-full md:w-80 lg:w-96 h-full border-r bg-white flex flex-col z-40`}
      >
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-4 mt-8 md:mt-0">
            <div className="flex items-center">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <h1 className="text-xl font-semibold ml-3">{user?.name || 'My Profile'}</h1>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search connections"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConnections.map((connection) => (
            <div
              key={connection.id}
              onClick={() => handleConnectionSelect(connection.connectedUser)}
              className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedConnection?.id === connection.connectedUser.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {connection.connectedUser?.profilePic ? (
                    <img
                      src={connection.connectedUser.profilePic}
                      alt={connection.connectedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {connection.connectedUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {connection.connectedUser?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {connection.connectedUser.lastSeen ? 
                        new Date(connection.connectedUser.lastSeen).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 
                        'Online'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {connection.connectedUser?.role || 'No status'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50 w-full">
        {selectedConnection ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {selectedConnection.profilePic ? (
                  <img
                    src={selectedConnection.profilePic}
                    alt={selectedConnection.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">{selectedConnection.name}</h2>
                  <p className="text-sm text-gray-500">
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button  onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting the connection when clicking the button
                      handleRemoveConnection(connections[0].id);
                    }}variant="ghost" size="icon">
                  <Trash  className="w-5 h-5 text-red-600" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3"
              style={{ backgroundImage: 'url("/chat-bg-pattern.png")', backgroundSize: 'contain' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                      msg.senderId === user?.id
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words text-sm sm:text-base">{msg.content}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-75">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                      {msg.senderId === user?.id && (
                        <span className="ml-1">
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-4 h-4 text-blue-200" />
                          ) : (
                            <Check className="w-4 h-4 text-blue-200" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-2 sm:p-4 bg-white border-t">
              <div className="flex items-center space-x-2">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Type a message"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="rounded-full"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500 p-4">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Select a connection</h2>
              <p className="text-sm sm:text-base">Choose a connection to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}