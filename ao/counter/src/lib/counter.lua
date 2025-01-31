local mod = {}

-- Initialize dailyTaps table if it doesn't exist
dailyTaps = dailyTaps or { address = {} }

--- Handler to increase Counter
--- @param msg Message
--- @return nil
mod.increaseCounter = function(msg)
    local currentTimestamp = os.time()

    -- Initialize user record if it doesn't exist
    if not dailyTaps.address[msg.From] then
        dailyTaps.address[msg.From] = {
            lastTimestamp = currentTimestamp,
            taps = 0
        }
    end

    local dailyTap = dailyTaps.address[msg.From]

    -- Reset counter if 24 hours have passed
    if (currentTimestamp - dailyTap.lastTimestamp > 86400) then
        dailyTap.lastTimestamp = currentTimestamp
        dailyTap.taps = 0
    end

    -- Check if daily limit reached BEFORE incrementing
    if (dailyTap.taps >= DAILY_LIMIT) then
        ao.send({
            Target = msg.From,
            Action = "Daily-Limit-Reached"
        })
        return -- Exit function without minting
    end

    -- Increment counters and mint token
    dailyTap.taps = dailyTap.taps + 1
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
