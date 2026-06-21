const seenPackets =
  new Set();

exports.claimPacket =
  (packetHash) => {

    if (
      seenPackets.has(
        packetHash
      )
    ) {
      return false;
    }

    seenPackets.add(
      packetHash
    );

    return true;
};

exports.clearCache =
  () => {
    seenPackets.clear();
};