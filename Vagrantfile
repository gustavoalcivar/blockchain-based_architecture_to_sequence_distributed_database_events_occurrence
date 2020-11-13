# -*- mode: ruby -*-
# vi: set ft=ruby :
ip_base = "192.168.100.20"
Vagrant.configure(2) do |config|
config.vm.box = 'ubuntu/focal64'
config.vm.box_check_update = true
config.vm.synced_folder ".", "/vagrant"
config.vm.provision "shell", path: "scripts/install_docker.sh"
config.vm.provider "virtualbox" do |vb|
    vb.memory = 512
    vb.cpus = 2
end
config.vm.define :node0, primary: true  do |node0|
    node0.vm.network :public_network, ip: "#{ip_base}0"
    node0.vm.hostname = "node0"
    node0.vm.provision "shell", path: "scripts/node_0.sh", :args => ["#{ip_base}"]
end
(1..3).each do |i|
    config.vm.define "node#{i}" do |nodei|
      nodei.vm.network :public_network, ip: "#{ip_base}#{i}"
      nodei.vm.hostname = "node#{i}"
      nodei.vm.provision "shell", path: "scripts/node_i.sh", :args => ["#{ip_base}", "#{i}"]
    end
  end
end