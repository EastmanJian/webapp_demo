package socket;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.Vector;

@ServerEndpoint("/timeClock")
public class TimeClockBridge {
    private static List<Session> users = new Vector<>();
    private static List<Session> robots = new Vector<>();

    public TimeClockBridge() {
        System.out.println("TimeClockBridge construct.. ThreadName=" + Thread.currentThread().getName());
    }

    @OnOpen
    public void onOpen(Session session) throws IOException {
        System.out.println("TimeClockBridge connected successfully. SessionID=" + session.getId());
        //tell the new user/robot the session id.
        session.getBasicRemote().sendText("session_ID: " + session.getId());
    }

    @OnClose
    public void onClose(Session session) throws IOException {
        System.out.println("TimeClockBridge session:" + session.getId() + " closed.");
        users.remove(session);
        robots.remove(session);
        //tell all clients in the bridge that a user/robot has quit.
        for (Session userSession : users) {
            userSession.getBasicRemote().sendText("[" + session.getId().substring(24) + "] has quit.");
            userSession.getBasicRemote().sendText("Total users: " + users.size());
            userSession.getBasicRemote().sendText("Total robots: " + robots.size());
        }
        for (Session robotSession : robots) {
            robotSession.getBasicRemote().sendText("[" + session.getId().substring(24) + "] has quit.");
            robotSession.getBasicRemote().sendText("Total users: " + users.size());
            robotSession.getBasicRemote().sendText("Total robots: " + robots.size());
        }
    }

    @OnMessage
    public void onMessage(Session session, String msg) throws IOException {
        System.out.println("TimeClockBridge receive message:[" + session.getId().substring(24) + "]" + msg);
        if (msg.contains("-----USER-----") || msg.contains("-----ROBOT-----")) {
            String role = msg.contains("-----USER-----") ? "user" : "robot";
            List<Session> list = msg.contains("-----USER-----") ? users : robots;
            list.add(session);
            //broadcast to all clients the message about new user's joining
            for (Session userSession : users) {
                userSession.getBasicRemote().sendText("New " + role + "[" + session.getId().substring(24) + "] joined the bridge.");
                userSession.getBasicRemote().sendText("Total users: " + users.size());
                userSession.getBasicRemote().sendText("Total robots: " + robots.size());
            }
            for (Session robotSession : robots) {
                robotSession.getBasicRemote().sendText("New " + role + "[" + session.getId().substring(24) + "] joined the bridge.");
                robotSession.getBasicRemote().sendText("Total users: " + users.size());
                robotSession.getBasicRemote().sendText("Total robots: " + robots.size());
            }
        } else if (msg.equals("Close All Robot Connections!")) {
            List<Session> currentRobots = new Vector<>(robots);
            for (Session robotSession : currentRobots) {
                robotSession.close();
            }
        } else if (msg.equals("Robot heartbeat.")) {
            session.getBasicRemote().sendText("echo: " + msg);
        } else {
            //get the role of the client
            String role = users.contains(session) ? "User" : "Robot";
            //broadcast the msg to all clients in the bridge
            for (Session userSession : users) {
                userSession.getBasicRemote().sendText("[" + role + "-" + session.getId().substring(24) + "] " + msg);
            }
            for (Session robotSession : robots) {
                robotSession.getBasicRemote().sendText("[" + role + "-" + session.getId().substring(24) + "] " + msg);
            }
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }
}
