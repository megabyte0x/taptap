local process = require "lib.counter"

--- @type string
Version       = "0.0.1"

--- @type number
Taps          = Taps or 0

--- @type string
TOKEN_PROCESS = TOKEN_PROCESS or "mCv0FbsLWlgNbn3B7VXTvM6_0gTn93k3yy7h63Uq4EQ"

--- @type number
DAILY_LIMIT   = 100

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
