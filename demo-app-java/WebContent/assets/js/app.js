$(document).ready(function(){
	var __modalTitle;
	var __api = 'api/endpoint?resource=';

	$('a').click(function (e) {
		// Cegah link untuk melalukan bubbling DOM
		e.preventDefault();
		// ambil Teks isi dari link yang di klik
		__modalTitle = $(this)[0].innerHTML;
		// Ambil alamat URL dari link yang di klik
		var uri = $(this).context.href.split(/\//).pop();
		// Lakukan proses pengambilan data tentang individual yang di klik
		// ke dalam API
		$.ajax({
			method: 'GET',
			url: __api + uri,
			dataType: 'JSON',
			success: processResponse,
			error: processError
		});
	});

	function processResponse (res) {
		// elemet HTML baru untuk menampung data hasil Query SPARQL yang ingin ditampilkan
		var modalNode = document.createElement('div'),
		// element tabel untuk menampilkan hasil query graph selain gambar dan comment
			modalContentTable = document.createElement('table');

		
		
		modalNode.setAttribute('style','text-align:center;width:100%');
		modalContentTable.setAttribute('id','modal-table');
		modalContentTable.setAttribute('cellspacing',0);
		//////////////////////////////////////////////////////////////
		// Lakukan iterasi untuk membentuk tampilan pada dialog box	//
		//////////////////////////////////////////////////////////////
		res.forEach(function (v,k) {
			console.log(v);
			/////////////////////////////////////////////////////////////////////////////////
			// Jika triple memiliki properti http://id.dbpedia.org/property/depiction
			// maka buat element img untuk merubah value dari properti menjadi elemen gambar 
			//////////////////////////////////////////////////////////////////////////////////
			if ( v. ) {
				var img = document.createElement('img');
				img.setAttribute('src', v.value);
				modalNode.insertBefore(img,modalNode.firstChild);
			}
			/////////////////////////////////////////////////////////////////////////////
			// Jika properti graph adalah http://www.w3.org/2000/01/rdf-schema#comment
			// maka ambil value dari graphnya dan bentuk menjadi teks komentar
			// di bawah gambar
			/////////////////////////////////////////////////////////////////////////////
			if ( v.match(/(comment)$/i) ) {
				var comment = document.createTextNode(v.value),
					p = document.createElement('p');
				p.appendChild(comment);
				modalNode.appendChild(p);
			} 
			////////////////////////////////////////////////////////////////////////////////////
			// Hasil query SPARQL terhadap Endpoint DBPedia Indonesia untuk resource tertentu
			// akan menghasilkan banyak statement, untuk itu sebagai contoh kita hanya akan
			// triple yang hanya memiliki properti namespace dari DBPedia Indonesia
			// http://id.dbpedia.org/property/*
			// Semua triple statement ini nantinya akan dibentuk menjadi tabel di bagian 
			// paling bawah dari dialog box
			/////////////////////////////////////////////////////////////////////////////////////
			if ( v.match(/(id.dbpedia.org)/i) ) {
				var tableRow = createTableRow(v);
				modalContentTable.appendChild(tableRow);
			}
		});
		// masukkan tabel ke dalam dialog box
		modalNode.appendChild(modalContentTable);

		// Tampilkan dialog box!
		$(modalNode).dialog({
			title:__modalTitle,
			minWidth: 500,
			modal:true
		});
	}

	function createTableRow(item) {
		var tableRow = document.createElement('tr'),
			keyColumn = document.createElement('td'),
			valueColumn = document.createElement('td'),
			itemKey,
			itemValue;

		itemKey = item.property.match(/^(http).*/) 
			? document.createTextNode(item.property.split(/[\/#]/).pop()) 
			: document.createTextNode(item.property);
		
		if ( !item.property.match(/(situs)/i) ) {
			var value = ( typeof(item.value) === 'string' && item.value.match(/^(http).*/) ) 
				? item.value.split(/[\/#]/).pop()
				: item.value;
			value = typeof(value) === 'string' ? value.split('_').join(' ') : value;
			itemValue = document.createTextNode(value);
		} else {
			itemValue = document.createElement('a');
			itemValue.appendChild(document.createTextNode(item.value));
			itemValue.setAttribute('href', item.value);
			itemValue.setAttribute('target','__blank');
		}

		keyColumn.appendChild(itemKey);
		valueColumn.appendChild(itemValue);
		tableRow.appendChild(keyColumn);
		tableRow.appendChild(valueColumn);
		return tableRow;
	}

	function processError(a, b) {
		console.log(a);
		var modalNode = document.createElement('div'),
			modalContent = document.createTextNode('Proses query ke Basis pengetahuan gagal, cek koneksi Internet Anda');
		modalNode.setAttribute('style','text-align:center;width:100%');
		modalNode.appendChild(modalContent);
		
		$(modalNode).dialog({
			modal:true
		});
	}
});