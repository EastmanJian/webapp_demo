package socket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Vector;

@ServerEndpoint("/chatRoom")
public class WebSocketChatRoom {
    private static Vector<Session> users = new Vector<>();

    public WebSocketChatRoom() {
        System.out.println("WebSocketChatRoom construct.. ThreadName=" + Thread.currentThread().getName());
    }

    @OnOpen
    public void onopen(Session session) {
        System.out.println("WebSocket connected successfully. SessionID=" + session.getId());
        users.add(session);
        try {
            //tell the new user his/her session id.
            session.getBasicRemote().sendText("session_ID: " + session.getId());
            //broadcast to all users the message about new user's joining
            for (Session userSession : users) {
                userSession.getBasicRemote().sendText("Welcome, new user joined the chat room with session ID="
                        + session.getId() + ". Thread Name=" + Thread.currentThread().getName()
                        + ". ChatRoom instance=" + this.hashCode());
                userSession.getBasicRemote().sendText("Total users: " + users.size());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void onclose(Session session) {
        System.out.println("WebSocketChatRoom session:" + session.getId() + " closed.");
        users.remove(session);
        try {
            //tell all users in the chat room that the current user
            for (Session userSession : users) {
                userSession.getBasicRemote().sendText("[" + session.getId() + "] has quit.");
                userSession.getBasicRemote().sendText("Total users: " + users.size());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @OnMessage
    public void onMessage(Session session, String msg) {
        try {
            //broadcast the msg to all users in the chat room
            for (Session userSession : users) {
                userSession.getBasicRemote().sendText("[" + session.getId().substring(24)  + "] " + msg);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }
}
