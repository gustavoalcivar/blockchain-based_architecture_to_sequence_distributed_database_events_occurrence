# -*- mode: ruby -*-
# vi: set ft=ruby :
ip_base = "192.168.100.20"
Vagrant.configure("2") do |config|
  config.vm.box = 'ubuntu/focal64'
  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1536
    vb.cpus = 2
  end
  (0..3).each do |i|
    config.vm.define "node#{i}" do |node|
      node.vm.network :public_network, ip: "#{ip_base}#{i}"
      node.vm.hostname = "node#{i}"
      node.vm.provision "shell", path: "scripts/init.sh", :args => ["#{i}", "#{ip_base}"]
      node.trigger.after :reload do |trigger|
        trigger.info = "Start Services node#{i}"
        trigger.run_remote = {path: "scripts/start.sh", :args => ["#{i}", "#{ip_base}"]}
      end
    end
  end
end