contract('RJToken', function(accounts) {
  it ("claimInitial should work fine", function() {
    var token = RJToken.deployed();
    var amountBefore;
   
    return token.balanceOf.call(accounts[0]).then(function(_amountBefore) {
      amountBefore = _amountBefore;
      return token.claimInitialed.call();
    }).then(function (initialed) {
      assert.equal(false, initialed, "account " + accounts[0] + "has claimed initial");
      return token.claimInitial({from: accounts[0]});
    }).then(function() {
      return token.balanceOf.call(accounts[0]);
    }).then(function(amountAfter){
      assert.equal(parseInt(amountBefore)+100, parseInt(amountAfter), "claimInitial should add 100 on account balance");
      return token.claimInitialed.call();
    }).then(function(initialed) {
      assert.equal(true, initialed, "account " + accounts[0] + "should claimed initial");
    });
  });

  it ("transfer should work fine", function() {
    var token = RJToken.deployed();
    var amount0, amount1;

    if (accounts.length >= 2) {
      return token.balanceOf.call(accounts[0]).then(function(_amount0) {
        amount0 = _amount0;
        return token.balanceOf.call(accounts[1]);
      }).then(function(_amount1) {
        amount1 = _amount1;
        return token.transfer(accounts[0], accounts[1], amount0);
      }).then(function() {
        return token.balanceOf.call(accounts[1]);
      }).then(function(_amount1After) {
        assert.equal(parseInt(_amount1After), parseInt(amount0) + parseInt(amount1), 
            "transfer error");
      });
    }
  });
});
