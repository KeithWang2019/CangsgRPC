package com.cangsg.rpc.center.web.controller;

import java.util.List;

import com.cangsg.rpc.center.handle.OperatorListenService;
import com.cangsg.rpc.core.proto.Node;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class CenterController {

    @RequestMapping(value = "/nodes", method = RequestMethod.POST)
    public List<Node> nodes() {
        return OperatorListenService.nodes;
    }

}