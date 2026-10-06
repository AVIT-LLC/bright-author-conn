Sub Main()
    msgPort = CreateObject("roMessagePort")
    node = CreateObject("roNodeJS", "index.js", { message_port: msgPort, node_arguments: ["--inspect=0.0.0.0:3000"] })

    while true
        ev = wait(0, msgPort)
        if type(ev) = "roNodeJsEvent"
            data = ev.GetData()
            if data.reason = "message" then
                if data.message.type = "getSystemLogs" then
                    GetSystemLogs(node, data.message.type)
                end if
            end if
        end if
    end while
End Sub

Sub GetSystemLogs(node, eventtype)
    systemLog = CreateObject("roSystemLog")
    logsArray = systemLog.ReadLog()
    jsonLogs = FormatJson(logsArray)
    node.PostJSMessage({ eventtype: eventtype, message: jsonLogs })
End Sub
