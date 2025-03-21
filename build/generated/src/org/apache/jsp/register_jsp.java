package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class register_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List<String> _jspx_dependants;

  private org.glassfish.jsp.api.ResourceInjector _jspx_resourceInjector;

  public java.util.List<String> getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;

    try {
      response.setContentType("text/html");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;
      _jspx_resourceInjector = (org.glassfish.jsp.api.ResourceInjector) application.getAttribute("com.sun.appserv.jsp.resource.injector");

      out.write("<!DOCTYPE html>\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("    <meta charset=\"UTF-8\">\r\n");
      out.write("    <title>IoTBay - Register</title>\r\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"CSS/styles.css\">\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("    <header>\r\n");
      out.write("        <h1>IoTBay</h1>\r\n");
      out.write("        <p>Your one-stop shop for IoT products</p>\r\n");
      out.write("    </header>\r\n");
      out.write("\r\n");
      out.write("    <div class=\"form-container\">\r\n");
      out.write("        <h2>Register</h2>\r\n");
      out.write("        <form action=\"welcome.jsp\" method=\"post\">\r\n");
      out.write("            Email: <input type=\"email\" name=\"email\" required><br><br>\r\n");
      out.write("            Full Name: <input type=\"text\" name=\"fullName\" required><br><br>\r\n");
      out.write("            Password: <input type=\"password\" name=\"password\" required><br><br>\r\n");
      out.write("            Gender:\r\n");
      out.write("            <input type=\"radio\" name=\"gender\" value=\"Male\" required> Male\r\n");
      out.write("            <input type=\"radio\" name=\"gender\" value=\"Female\"> Female<br><br>\r\n");
      out.write("            Favourite Colour:\r\n");
      out.write("            <select name=\"favouriteColour\" required>\r\n");
      out.write("            <option value=\"red\">Red</option>\r\n");
      out.write("            <option value=\"blue\">Blue</option>\r\n");
      out.write("            <option value=\"green\">Green</option>\r\n");
      out.write("            <option value=\"yellow\">Yellow</option>\r\n");
      out.write("            </select><br><br>\r\n");
      out.write("            Agree to TOS: <input type=\"checkbox\" name=\"agreeTOS\" required><br><br>\r\n");
      out.write("            <input type=\"submit\" value=\"Register\">\r\n");
      out.write("            </form>\r\n");
      out.write("        <p>Already have an account? <a href=\"login.jsp\">Login here</a></p>\r\n");
      out.write("    </div>\r\n");
      out.write("\r\n");
      out.write("    <footer>\r\n");
      out.write("        <p>&copy; IoTBay Team 5</p>\r\n");
      out.write("    </footer>\r\n");
      out.write("</body>\r\n");
      out.write("</html>");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
