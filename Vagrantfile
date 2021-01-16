# -*- mode: ruby -*-
# vi: set ft=ruby :
ip_base = "192.168.100"
ip_node = ".20"
ip_win = ".19"
Vagrant.configure("2") do |config|
  (0..3).each do |i|
    config.vm.define "node#{i}" do |node|
      node.vm.box = 'ubuntu/focal64'
      node.vm.synced_folder ".", "/vagrant"
      node.vm.network :public_network, ip: "#{ip_base}#{ip_node}#{i}"
      node.vm.hostname = "node#{i}"
      node.vm.provider "virtualbox" do |vb|
        vb.memory = i == 0 ? 1536 : 1024
        vb.cpus = 2
      end
      node.vm.provision "shell", path: "scripts/init.sh", :args => ["#{i}", "#{ip_base}#{ip_node}"]
      node.trigger.after :reload do |trigger|
        trigger.info = "Start Services node#{i}"
        trigger.run_remote = {path: "scripts/start.sh", :args => ["#{i}", "#{ip_base}#{ip_node}"]}
      end
    end
  end
  (0..3).each do |i|  
    config.vm.define "win#{i}" do |win|
      win.vm.box = "gusztavvargadr/sql-server-developer-windows-server"
      win.vm.box_version = "2019.1809.2010"
      win.vm.network :public_network, ip: "#{ip_base}#{ip_win}#{i}"
      win.vm.hostname = "win#{i}"
      win.vm.provider "virtualbox" do |vb|
        vb.memory = 2048
        vb.cpus = 2
      end
    end
  end
end