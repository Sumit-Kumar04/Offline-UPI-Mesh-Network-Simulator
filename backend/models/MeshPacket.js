class MeshPacket {
  constructor(
    packetId,
    ttl,
    createdAt,
    ciphertext
  ) {
    this.packetId = packetId;
    this.ttl = ttl;
    this.createdAt = createdAt;
    this.ciphertext = ciphertext;
  }
}

module.exports = MeshPacket;