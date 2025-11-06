/**
 * AI Chat Screen
 *
 * Chat with AI wellness assistant for emotional support
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAIStore } from '../../src/stores/aiStore';

export default function ChatScreen() {
  const {
    currentConversation,
    isChatLoading,
    chatError,
    sendMessage,
    clearCurrentConversation,
  } = useAIStore();

  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (currentConversation.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentConversation]);

  useEffect(() => {
    // Show error alert if chat fails
    if (chatError) {
      Alert.alert('Chat Error', chatError);
    }
  }, [chatError]);

  const handleSend = async () => {
    if (!inputMessage.trim()) {
      return;
    }

    if (inputMessage.length > 500) {
      Alert.alert('Message Too Long', 'Please keep your message under 500 characters.');
      return;
    }

    const message = inputMessage.trim();
    setInputMessage(''); // Clear input immediately

    const success = await sendMessage(message);
    if (!success && chatError) {
      // Error alert shown by useEffect
    }
  };

  const handleNewConversation = () => {
    Alert.alert(
      'New Conversation',
      'Start a fresh conversation? Your current chat will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'New Chat',
          onPress: () => clearCurrentConversation(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Wellness Assistant</Text>
        {currentConversation.length > 0 && (
          <TouchableOpacity onPress={handleNewConversation}>
            <Text style={styles.newChatButton}>New Chat</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {currentConversation.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Start a Conversation</Text>
            <Text style={styles.emptyText}>
              Share how you're feeling, and I'll provide compassionate support and insights.
            </Text>
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Try asking:</Text>
              <TouchableOpacity
                style={styles.suggestionBubble}
                onPress={() => setInputMessage("I'm feeling stressed today")}
              >
                <Text style={styles.suggestionText}>I'm feeling stressed today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionBubble}
                onPress={() => setInputMessage("What are some ways to feel calmer?")}
              >
                <Text style={styles.suggestionText}>What are some ways to feel calmer?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionBubble}
                onPress={() => setInputMessage("How can I improve my mood?")}
              >
                <Text style={styles.suggestionText}>How can I improve my mood?</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          currentConversation.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.aiText,
                ]}
              >
                {msg.content}
              </Text>
              {msg.role === 'assistant' && (
                <Text style={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          ))
        )}

        {/* Loading indicator */}
        {isChatLoading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#6B9F7D" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Share how you're feeling..."
          placeholderTextColor="#999999"
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          maxLength={500}
          editable={!isChatLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputMessage.trim() || isChatLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Character count */}
      {inputMessage.length > 400 && (
        <Text style={styles.charCount}>
          {inputMessage.length}/500
        </Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  newChatButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B9F7D',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  suggestionBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6B9F7D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#6B9F7D',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6B9F7D',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333333',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#6B9F7D',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
});
