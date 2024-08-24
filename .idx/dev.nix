{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    
  
 "esbenp.prettier-vscode"
 "ritwickdey.LiveServer"
 "vitest.explorer"];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web"; 
      };
    };
  };
}