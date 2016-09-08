import "./RJToken.sol";

contract RJFund {
    address[] public campaigns;  
    address public token; 

    mapping(address => address[]) public contributeOf;

    event NewCampaign(address campaign);

    function RJFund(address _token) {
        token = RJToken(_token);
    }

    function newCampaign(address _campaign) {
        campaigns.push(_campaign);

        NewCampaign(_campaign);
    }
    
    function newContribute(address contributor, address campaign) {
        contributeOf[contributor].push(campaign);
    }
}
