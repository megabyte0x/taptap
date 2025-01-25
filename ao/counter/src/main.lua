local process = require "lib.counter"

--- @type string
Version       = "0.0.1"

--- @type number
Taps          = Taps or 0

--- @type string
TOKEN_PROCESS = TOKEN_PROCESS or "UyT-6VeNCvECBIFX_MGJrahCzK4T3g5Qr8-yfh9Z9ak"

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
