package com.cangsg.rpc.center.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class IndexFilter implements Filter {

    @Override
    public void destroy() {
        System.out.println("filter destroy");
    }

    @Override
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain fc)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) arg0;

        if (request.getMethod().equals("GET")) {
            String uri = request.getRequestURI();
            if (!uri.equals("/")) {
                int point = uri.lastIndexOf(".");
                if (point > 0) {
                    String ext = uri.substring(point, uri.length());
                    if (!ext.isEmpty()) {
                        fc.doFilter(arg0, arg1);
                        return;
                    }
                }

                request.getRequestDispatcher("/").forward(arg0, arg1);                
                return;
            }
        }
        fc.doFilter(arg0, arg1);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
        System.out.println("filter init");
    }

}