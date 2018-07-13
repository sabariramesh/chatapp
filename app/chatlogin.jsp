<%@ page import ="java.sql.*" %>
<%
    try{
        String username = request.getParameter("username");   
        String password = request.getParameter("password");
        Class.forName("com.mysql.jdbc.Driver");  
		Connection	con=DriverManager.getConnection("jdbc:mysql://localhost:3306/users","root","");
		String query = "select * from users";
        ResultSet rs = stmt.executeQuery(query);
			while(rs.next()) {
				if ((username.equals(rs.getString(1))) && (password.equals(rs.getString(2)))) {
					flag = 1;
					out.println("success");
				}	
			}           
   }
   catch(Exception e){       
       out.println("Something went wrong !! Please try again");       
   }      
%>