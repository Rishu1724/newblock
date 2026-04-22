// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Certificate {
    address public admin;

    struct CertData {
        string name;
        string course;
        string hash;
        bool exists;
    }

    mapping(string => CertData) private certificates;

    event CertificateIssued(string id, string name, string course, string hash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue certificates");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(
        string memory _id,
        string memory _name,
        string memory _course,
        string memory _hash
    ) public onlyAdmin {
        require(!certificates[_id].exists, "Certificate with this ID already exists");

        certificates[_id] = CertData({
            name: _name,
            course: _course,
            hash: _hash,
            exists: true
        });

        emit CertificateIssued(_id, _name, _course, _hash);
    }

    function getCertificate(string memory _id) public view returns (string memory, string memory, string memory, bool) {
        CertData memory cert = certificates[_id];
        return (cert.name, cert.course, cert.hash, cert.exists);
    }
}
