{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  # Add pkg-config to nativeBuildInputs so its setup hook runs
  nativeBuildInputs = with pkgs; [ pkg-config ];

  # Add openssl to buildInputs so the library is available
  buildInputs = with pkgs; [ openssl sea-orm-cli bacon yarn ];
}
