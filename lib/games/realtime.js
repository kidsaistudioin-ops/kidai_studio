import { supabase } from '@/lib/supabase';

// 🎮 MULTIPLAYER GAME ROOM MANAGER
// Ye Supabase WebSockets ka use karke live matchmaking aur moves sync karta hai
export const initGameRoom = (matchId, userProfile, callbacks) => {
  // Har match ka ek unique channel hoga (e.g., "game-ludo-123")
  const channel = supabase.channel(`game-${matchId}`, {
    config: {
      presence: { key: userProfile.id || `guest-${Date.now()}` },
      broadcast: { self: false } // Khud ka move wapas nahi sunna
    }
  });

  channel
    // 1. PRESENCE: Jab koi naya baccha room join/leave karega
    .on('presence', { event: 'sync' }, () => {
      const players = channel.presenceState();
      callbacks.onPlayersUpdate(players);
    })
    // 2. BROADCAST: Jab doosra player koi chal (move) chalega
    .on('broadcast', { event: 'move' }, (payload) => {
      callbacks.onMoveReceived(payload.payload);
    })
    // 3. CHAT: Jab bacche emojis bhejenge
    .on('broadcast', { event: 'chat' }, (payload) => {
      callbacks.onChatReceived(payload.payload);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Room mein apna status "playing" dikhao
        await channel.track({ name: userProfile.name, avatar: userProfile.avatar, status: 'playing' });
      }
    });

  // Return functions jo frontend se call hongi
  return {
    sendMove: (moveData) => channel.send({ type: 'broadcast', event: 'move', payload: moveData }),
    sendChat: (msgData) => channel.send({ type: 'broadcast', event: 'chat', payload: msgData }),
    leave: () => supabase.removeChannel(channel)
  };
};