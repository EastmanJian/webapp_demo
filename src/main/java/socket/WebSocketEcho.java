package socket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/webSocketEcho")
public class WebSocketEcho {
    public WebSocketEcho(){
        System.out.println("WebSocketEcho construct.. ThreadName=" + Thread.currentThread().getName());
    }

    @OnOpen
    public void onopen(Session session){
        System.out.println("WebSocket connected successfully. SessionID=" +session.getId());
        try {
            session.getBasicRemote().sendText("Hello there. Your SessionID=" +session.getId());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @OnClose
    public void onclose(Session session){
        System.out.println(" WebSocketEchoclose....");

    }
    @OnMessage
    public void onMessage(Session session,String msg){
        try {
            session.getBasicRemote().sendText("["+session.getId()+"]:"+msg);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }
}
