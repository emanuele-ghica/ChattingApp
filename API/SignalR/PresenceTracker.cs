using System;

namespace API.SignalR;

public class PresenceTracker
{
    private static readonly Dictionary<string, List<string>> OnlineUser = [];

    public Task<bool> UserConnected(string username, string connectionId)
    {
        var isOnline = false;
        lock (OnlineUser)
        {
            if (OnlineUser.ContainsKey(username))
            {
                OnlineUser[username].Add(connectionId);
            } 
            else 
            {
                OnlineUser.Add(username, [connectionId]);
                isOnline = true;
            }
        }

        return Task.FromResult(isOnline);
    }

    public Task<bool> UserDisconnected(string username, string connectionId) 
    {
        var isOffline = false;
        lock (OnlineUser)
        {
            if (!OnlineUser.ContainsKey(username)) return Task.FromResult(isOffline);

            OnlineUser[username].Remove(connectionId);

            if (OnlineUser[username].Count == 0)
            {
                OnlineUser.Remove(username);
                isOffline = true;
            }
        }
        return Task.FromResult(isOffline);
    }

    public Task<string[]> GetOnlineUsers()
    {
        string[] onlineUsers;
        lock(OnlineUser)
        {
            onlineUsers = OnlineUser.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
        }
        return Task.FromResult(onlineUsers);
    }

    public static Task<List<string>> GetConnectionForUser(string username) 
    {
        List<string> connectionIds;

        if(OnlineUser.TryGetValue(username, out var connections))
        {
            lock(connections)
            {
                connectionIds = connections.ToList();
            }
        }
        else 
        {
            connectionIds = [];
        }

        return Task.FromResult(connectionIds);
    }

}
