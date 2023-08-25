{
  description = "A very basic flake";


  outputs = { self, nixpkgs }:
  let pkgs = nixpkgs.legacyPackages.x86_64-linux;
      nodeDeps = (pkgs.callPackage ./default.nix {}).nodeDependencies;
  in
  {

    devShell.x86_64-linux = with nixpkgs.legacyPackages.x86_64-linux; mkShell {
      buildInputs = [
        nodePackages.npm
        nodePackages.typescript
        nodePackages.typescript-language-server
        nodejs
        node2nix
      ];
    };

  };
}
