package filetransfer;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.util.Date;

@WebServlet(name = "FileListServlet", urlPatterns = {"/file_tran/list"})
public class FileListServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathname = "/srv/www/htdocs/userfiles";
        String[] files;
        File dir = new File(pathname);
        files = dir.list();
        File file;
        DateFormat dtf = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.MEDIUM);

        StringBuffer fileList = new StringBuffer();
        for (String fileName : files) {
            file = new File(pathname + File.separator + fileName);
            if (!file.isDirectory()) {
                fileList.append("[" + "\"<A href='/userfiles/" + fileName + "'>" + fileName + "</A>\", \""
                        + String.format("%,d", file.length()) + "\", \""
                        + dtf.format(new Date(file.lastModified())) + "\"],"
                );
            }
        }
        fileList.deleteCharAt(fileList.length() - 1); //delete the last comma


        final PrintWriter writer = response.getWriter();
        writer.write("{\"data\": [");
        writer.write(fileList.toString());
        writer.write("]}");

        System.out.println("Total " + files.length + " files.");

    }
}
