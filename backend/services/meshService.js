const devices =
  require("../data/meshStore");

  

exports.injectPacket = (
  packet,
  sender
) => {

  const senderDevice =
    devices.find(
      d =>
        d.id ===
        `phone-${sender.toLowerCase()}`
    );

  if (!senderDevice) {
    throw new Error(
      "Sender device not found"
    );
  }

  senderDevice.packets.push(
    packet
  );

  return senderDevice;
};

exports.getMeshState =
  () => devices;



const {
 ingestPacket
} = require(
 "./bridgeService"
);

exports.flushBridge = async () => {

  const bridge =
    devices.find(
      d => d.hasInternet
    );
    if (bridge.packets.length === 0) {
    return {
      message: "No packets available"
    };
  }

  const results = [];

  for (const packet of bridge.packets) {

    try {

      const tx =
        await ingestPacket(packet);

      results.push(tx);

    } catch (err) {

      results.push({
        error: err.message
      });

    }

  }

  // Clear bridge packets after upload
  bridge.packets = [];

  return results;
};

exports.runGossipRound = () => {

  devices.forEach(sender => {

    sender.packets.forEach(packet => {

      if(packet.ttl <= 0) return;

      devices.forEach(receiver => {

        if(sender.id !== receiver.id){

          const exists =
            receiver.packets.find(
              p => p.packetId === packet.packetId
            );

          if(!exists){
            receiver.packets.push({
              ...packet,
              ttl: packet.ttl - 1
            });
          }

        }

      });

    });

  });

  return devices;
};

exports.resetMesh = () => {

  devices.forEach(device => {
    device.packets = [];
  });

};