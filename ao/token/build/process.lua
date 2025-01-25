--[[
  This module implements the ao Standard Token Specification.

  Terms:
    Sender: the wallet or Process that sent the Message

  It will first initialize the internal state, and then attach Handlers,
    according to the ao Standard Token Spec API:

    - Info(): return the token parameters, like Name, Ticker, Logo, and Denomination

    - Balance(Target?: string): return the token balance of the Target. If Target is not provided, the Sender
        is assumed to be the Target

    - Balances(): return the token balance of all participants

    - Transfer(Target: string, Quantity: number): if the Sender has a sufficient balance, send the specified Quantity
        to the Target. It will also issue a Credit-Notice to the Target and a Debit-Notice to the Sender

    - Mint(Quantity: number): if the Sender matches the Process Owner, then mint the desired Quantity of tokens, adding
        them the Processes' balance
]] --
local json = require('json')

--[[
  Initialize State

  ao.id is equal to the Process.Id
]] --
if not Balances then Balances = {} end

if Name ~= 'Tap Tap' then Name = 'Tap Tap' end

if Ticker ~= 'TAP' then Ticker = 'TAP' end

if Denomination ~= 18 then Denomination = 18 end

if not Logo then Logo = 'kPZd6glwsQIjT1x0hBIQIZPDM3YSeoZmafr9NRfo5O4' end

COUNTER_PROCESS = "k5kpwc4j_G36nhvx5GyI9l9yzHhYRyF8oIZ0m3qB4vg"

--[[
  Add Handlers for each incoming Action defined by the ao Standard Token Specification
]] --

--[[
  Info
]] --
Handlers.add('Info', function(msg)
    Send(
        { Target = msg.From, Tags = { Name = Name, Ticker = Ticker, Logo = Logo, Denomination = tostring(Denomination) } })
end)

--[[
  Balance
]] --
Handlers.add('Balance', function(msg)
    local bal = '0'

    -- If not Target is provided, then return the Senders balance
    if (msg.Tags.Recipient and Balances[msg.Tags.Recipient]) then
        bal = tostring(Balances[msg.Tags.Recipient])
    elseif Balances[msg.From] then
        bal = tostring(Balances[msg.From])
    end

    Send({
        Target = msg.From,
        Tags = { Target = msg.From, Balance = bal, Ticker = Ticker, Data = json.encode(tonumber(bal)) }
    })
end)

--[[
  Balances
]] --
Handlers.add('Balances', function(msg) Send({ Target = msg.From, Data = json.encode(Balances) }) end)

--[[
  Transfer
]] --
Handlers.add('Transfer', function(msg)
    assert(type(msg.Tags.Recipient) == 'string', 'Recipient is required!')
    assert(type(msg.Tags.Quantity) == 'string', 'Quantity is required!')

    if not Balances[msg.From] then Balances[msg.From] = 0 end

    if not Balances[msg.Tags.Recipient] then Balances[msg.Tags.Recipient] = 0 end

    local qty = tonumber(msg.Tags.Quantity)
    assert(type(qty) == 'number', 'qty must be number')

    if Balances[msg.From] >= qty then
        Balances[msg.From] = Balances[msg.From] - qty
        Balances[msg.Tags.Recipient] = Balances[msg.Tags.Recipient] + qty

        --[[
      Only send the notifications to the Sender and Recipient
      if the Cast tag is not set on the Transfer message
    ]] --
        if not msg.Tags.Cast then
            -- Send Debit-Notice to the Sender
            Send({
                Target = msg.From,
                Tags = { Action = 'Debit-Notice', Recipient = msg.Tags.Recipient, Quantity = tostring(qty) }
            })
            -- Send Credit-Notice to the Recipient
            Send({
                Target = msg.Tags.Recipient,
                Tags = { Action = 'Credit-Notice', Sender = msg.From, Quantity = tostring(qty) }
            })
        end
    else
        Send({
            Target = msg.Tags.From,
            Tags = { Action = 'Transfer-Error', ['Message-Id'] = msg.Id, Error = 'Insufficient Balance!' }
        })
    end
end)

--[[
 Mint
]] --
Handlers.add('Mint', function(msg)
    assert(type(msg.Tags.Recipient) == 'string', 'Recipient is required!')

    if msg.From == COUNTER_PROCESS then
        -- Mint tokens to the sender
        local qty = 1 * 10 ^ Denomination

        if not Balances[msg.Recipient] then Balances[msg.Recipient] = 0 end
        Balances[msg.Recipient] = Balances[msg.Recipient] + qty

        -- Send Credit-Notice to the Recipient
        Send({
            Target = msg.Recipient,
            Tags = { Action = 'Credit-Notice', Sender = "Tap Tap Mint", Quantity = tostring(qty) }
        })
    else
        Send({
            Target = msg.Tags.From,
            Tags = {
                Action = 'Mint-Error',
                ['Message-Id'] = msg.Id,
                Error = 'Only the Counter can mint new ' .. Ticker .. ' tokens!'
            }
        })
    end
end)
