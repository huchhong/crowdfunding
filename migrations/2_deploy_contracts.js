module.exports = function(deployer) {
  deployer.deploy(RJToken, 100).then(function(){
    return deployer.deploy(RJFund, RJToken.address);
  }).then(function() {
    var expiery = Date.now() + 1200;
    return deployer.deploy(Campaign, RJToken.address, RJFund.address, 0x0, 100, expiery);
  });
};
