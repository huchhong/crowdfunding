import "./RJToken.sol";
import "./RJFund.sol";

contract Campaign {
    address public beneficiary;
    address public owner;
    uint public goal;             
    uint public totalAmount;      
    uint public expiry;
    uint public numContributors;

    RJToken token;
    RJFund fund;

    struct Contribution{
        address contributor;
        uint amount;
        uint time;
        bool refunded;
    }
    uint numContribution;
    mapping (uint => Contribution) contributions;
    mapping (address => uint[]) toContribution;

    bool paidOut;

    event Contributed(address from, uint value);

    function Campaign(address _token, address _rjfund, address _b, uint _goal, uint _expiry) {
        token = RJToken(_token);
        fund = RJFund(_rjfund);
        goal = _goal;
        expiry = _expiry;
        owner = msg.sender;
        if (_b != 0x0) {
            beneficiary = _b;
        }else {
            beneficiary = msg.sender;
        }

        fund.newCampaign(this);
    }

    function contribute(uint value) {
        if (now >= expiry || value <= 0 || paidOut) throw;
        if (token.balanceOf(msg.sender) < value) throw;

        uint id = numContribution++;
        Contribution c = contributions[id];
        c.contributor = msg.sender;
        c.amount = value;
        c.refunded = false;
        c.time = now;

        token.transfer(msg.sender, this, value);

        totalAmount += value;

        if (toContribution[msg.sender].length == 0) {
            numContributors++;    
        }

        toContribution[msg.sender].push(id); 
    
        fund.newContribute(msg.sender, this);
        Contributed(msg.sender, value);
    }

    function isSuccess() constant returns(bool) {
        if (totalAmount >= goal) {
            return true;
        } else {
            return false;
        }
    }

    function isFailed() constant returns (bool) {
        if (now >= expiry && totalAmount < goal) {
            return true;
        }else {
            return false;
        }
    }

    function isPaidOut() constant returns (bool) {
        return paidOut;
    }

    function payout() {
        if (!isSuccess() || paidOut) throw;

        token.transfer(this, beneficiary, totalAmount);

        paidOut = true;
    }

    function refund() {
        if (!isFailed()) throw; 
        
        for (var i = 0; i < toContribution[msg.sender].length; i++) {
            Contribution c = contributions[toContribution[msg.sender][i]];

            if (c.refunded == true) continue;

            token.transfer(this, msg.sender, c.amount); 
            c.refunded = true;
        }
    }

    function isRefunded() constant returns (bool){
        for (var i = 0; i < toContribution[msg.sender].length; i++) {
            Contribution c = contributions[toContribution[msg.sender][i]];

            if (!c.refunded) return false;
        }  
        return true;
    }

    function isActive() constant returns (bool) {
        if (isFailed() || paidOut) {
            return false;
        }else {
            return true;
        }
    }

    function totalContributionOf(address contributor) constant returns (uint totalAmount) {
        totalAmount = 0;
        for (var i = 0; i < toContribution[contributor].length; i++) {
            Contribution c = contributions[toContribution[contributor][i]]; 
            totalAmount += c.amount;
        }
    }
}
