contract("Campaign", function(accounts) {
  it ("contribute should work fine", function() {
    var campaign = Campaign.deployed();
    var token = RJToken.deployed();
    var contributor = accounts[1];
    var balanceOfContributor;
    var goal;
    var totalAmountBefore;
    var totalAmountAfter;
    var balanceOfBeneficiary;
    var beneficiary;

    return campaign.goal.call().then(function(_goal) {
      goal = _goal; 
      return token.issue(contributor, goal);
    }).then(function() {
      return campaign.beneficiary.call();
    }).then(function(address) {
      beneficiary = address;
      return token.balanceOf.call(beneficiary);
    }).then(function(_balance) {
      balanceOfBeneficiary = parseInt(_balance);
      return token.balanceOf.call(contributor);
    }).then(function(_balance) {
      balanceOfContributor = _balance;
      return campaign.totalAmount.call();
    }).then(function(_totalAmount) {
      totalAmountBefore = parseInt(_totalAmount);
      return token.balanceOf.call(campaign.address); 
    }).then(function(balance) {
      assert.equal(0, parseInt(balance), "balance of campaign should be zero at first");
      return campaign.contribute(goal/2, {from: contributor});
    }).then(function() {
      return token.balanceOf.call(campaign.address);
    }).then(function(balance) {
      assert.equal(parseInt(balance), goal/2, "balance of campaign should be half goal now");
      return campaign.totalAmount.call();
    }).then(function(totalAmount) {
      assert.equal(parseInt(totalAmount), totalAmountBefore + goal/2, "totalAmount should be half goal now");
      return token.balanceOf.call(contributor);
    }).then(function(balance) {
      assert.equal(parseInt(balance), balanceOfContributor - goal/2, "balance of contributer should be half goal smaller than before");
      return campaign.isSuccess.call();
    }).then(function(isSuccess) {
      assert.equal(false, isSuccess, "campaign should not be successful by now");
      return campaign.contribute(goal/2, {from: contributor});
    }).then(function() {
      return campaign.isSuccess.call(); 
    }).then(function(isSuccess) {
      assert.equal(true, isSuccess, "campaign should be successfully by now");
      return campaign.totalAmount.call();
    }).then(function(totalAmount) {
      totalAmountAfter = totalAmount;
      return campaign.payout();
    }).then(function() {
      return token.balanceOf.call(beneficiary);
    }).then(function(balance) {
      assert.equal(parseInt(totalAmountAfter) + balanceOfBeneficiary, parseInt(balance), 
          "balance of beneficiary should add " + totalAmountAfter);
    });
  });
});
