local mod = {}

--- Handler to increase Counter
--- @param msg Message
--- @return nil
mod.increaseCounter = function(msg)
    Taps = Taps + 1

    ao.send({
        Target = TOKEN_PROCESS,
        Action = "Mint",
        Recipient = msg.From
    })
end

--- Handler to set the Token Process
--- @param msg Message
--- @return nil
mod.setTokenProcess = function(msg)
    if (msg.From == env.Process.Id or msg.From == Owner) then
        TOKEN_PROCESS = msg.Tags.TokenProcess
    else
        ao.send({
            Target = msg.From,
            Tags = { Action = 'Set-Token-Process-Error', Error = 'Only the Process Owner can set the Token Process!' }
        })
    end
end

return mod
