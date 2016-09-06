contract RJToken {
    mapping (address => uint) public balanceOf;
    mapping (address => bool) public initial;
    address public owner;
    uint initToken;

    function RJToken(uint _initToken) {
        owner = msg.sender;
        initToken = _initToken;
    }

    function issue(address _to, uint _value) {
        if (msg.sender == owner) {
            balanceOf[_to] += _value;
        }
    }

    function claimInitial() {
        if (initial[msg.sender]) throw;
        initial[msg.sender] = true;
        balanceOf[msg.sender] += initToken;
    }

    function claimInitialed() constant returns (bool) {
        if (initial[msg.sender])
            return true;
        else
            return false;
    }

    function transfer(address _from, address _to, uint _value) {
        if (_from != msg.sender && _from != tx.origin) throw;

        if (balanceOf[_from] < _value) throw;
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
    }
}
