# -*- mode: ruby -*-
# vi: set ft=ruby :
ip_base = "192.168.100.20"
Vagrant.configure("2") do |config|
  (0..3).each do |i|
    config.vm.define "node#{i}" do |node|
      node.vm.box = 'ubuntu/focal64'
      node.vm.synced_folder ".", "/vagrant"
      node.vm.network :public_network, ip: "#{ip_base}#{i}"
      node.vm.hostname = "node#{i}"
      node.vm.provider "virtualbox" do |vb|
        vb.memory = i == 0 ? 2048 : 1024
        vb.cpus = 2
      end
      node.vm.provision "shell", path: "scripts/init.sh", :args => ["#{i}", "#{ip_base}"]
      node.trigger.after :reload do |trigger|
        trigger.info = "Start Services node#{i}"
        trigger.run_remote = {path: "scripts/start.sh", :args => ["#{i}", "#{ip_base}"]}
      end
    end
  end
  config.vm.define "winserver" do |winserver|
    winserver.vm.box = "gusztavvargadr/sql-server-developer-windows-server"
    winserver.vm.box_version = "2019.1809.2010"
    winserver.vm.network :public_network, ip: "192.168.100.199"
    winserver.vm.provider "virtualbox" do |vb|
      vb.memory = 2048
      vb.cpus = 2
    end
  end
end