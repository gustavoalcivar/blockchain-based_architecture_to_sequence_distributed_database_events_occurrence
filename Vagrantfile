# -*- mode: ruby -*-
# vi: set ft=ruby :
# vagrant plugin install vagrant-vbguest
ip_base = "192.168.100.20"
Vagrant.configure("2") do |config|
  #config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1536
    vb.cpus = 2
  end
  (0..3).each do |i|
    config.vm.define "node#{i}" do |node|
      node.vm.box = i == 0 ? 'debian10-base' : 'debian10-base'
      node.vm.network :public_network, ip: "#{ip_base}#{i}"
      node.vm.hostname = "node#{i}"
      node.vm.provision "shell", path: "scripts/init.sh", :args => ["#{i}"]
      node.trigger.before :reload do |trigger|
        trigger.info = "Leave Swarm Network"
        trigger.run_remote = {inline: "docker swarm leave --force || true"}
      end
      node.trigger.after :reload do |trigger|
        trigger.info = "Start Services node#{i}"
        trigger.run_remote = {path: "scripts/start.sh", :args => ["#{i}", "#{ip_base}"]}
      end
    end
  end
end