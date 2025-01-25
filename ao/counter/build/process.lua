do
local _ENV = _ENV
package.preload[ "lib.counter" ] = function( ... ) local arg = _G.arg;
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
end
end

local process = require "lib.counter"

--- @type string
Version       = "0.0.1"

--- @type number
Taps          = Taps or 0

--- @type string
TOKEN_PROCESS = TOKEN_PROCESS or "mCv0FbsLWlgNbn3B7VXTvM6_0gTn93k3yy7h63Uq4EQ"

--- Handler to get Info
--- @param msg Message
--- @return nil
local function infoHandler(msg)
    ao.send({
        Target = msg.From,
        Version = Version,
        TokenProcess = TOKEN_PROCESS,
        TotalTaps = tostring(Taps)
    })
end

-- Handler to get Info
Handlers.add("Info",
    infoHandler
)

-- Handler to increase Counter
Handlers.add("Increase",
    process.increaseCounter
)

Handlers.add("Set-Token-Process",
    process.setTokenProcess
)
