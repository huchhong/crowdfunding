module.exports = function(deployer) {
  deployer.deploy(RJToken, 100).then(function(){
    var expiry = Date.now() + 1200;
    return deployer.deploy(Campaign, RJToken.address, 0x0, 30, expiry);
  });
};
