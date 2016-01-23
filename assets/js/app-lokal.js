$(document).ready(function(){
	var __modalTitle;
	var __api = 'endpoint/graph-api.php?resource=';

	$('a').click(function (e) {
		// Cegah link untuk melalukan bubbling DOM
		e.preventDefault();
		// ambil Teks isi dari link yang di klik
		__modalTitle = $(this)[0].innerHTML;
		// Ambil alamat URL dari link yang di klik
		var uri = $(this).context.href.split(/\//).pop();
		// console.log(uri.split(/\//).pop());
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
		// Buat elemet HTML baru untuk menampung data hasil Query SPARQL yang ingin ditampilkan
		var modalNode = document.createElement('div'),
			modalContentTable = document.createElement('table');
		modalNode.setAttribute('style','text-align:center;width:100%;font-size:12px');
		modalContentTable.setAttribute('id','modal-table');
		modalContentTable.setAttribute('cellspacing',0);
		/////////////////
		// sebagai contoh misalnya kita ingin menampilkan isi dari field rdf#comment
		// dan foaf/depiction (jika ada)
		//////////////////
		res.forEach(function (v,k) {
			if ( v.property.match(/(gambar)$/) ) {
				var img = document.createElement('img');
				img.setAttribute('src', v.value);
				modalNode.insertBefore(img,modalNode.firstChild);
			} else if ( v.property.match(/(comment)$/i) ) {
				var comment = document.createTextNode(v.value),
					p = document.createElement('p');
				p.appendChild(comment);
				modalNode.appendChild(p);
			} else {
				var tableRow = createTableRow(v);
				modalContentTable.appendChild(tableRow);
			}
		});
		modalNode.appendChild(modalContentTable);
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
			itemKey = item.property.split(/\:/).pop(),
			itemValue = item.value.match(/^(http).*/) ? item.value.split(/[\/#]/).pop() : item.value;

		itemValue = itemValue.split('_').join(' ');

		keyColumn.appendChild(document.createTextNode(itemKey));
		valueColumn.appendChild(document.createTextNode(itemValue));
		tableRow.appendChild(keyColumn);
		tableRow.appendChild(valueColumn);
		return tableRow;
	}

	function processError() {
		var modalNode = document.createElement('div'),
			modalContent = document.createTextNode('Proses query ke Basis pengetahuan gagal, cek koneksi Internet Anda');
		modalNode.setAttribute('style','text-align:center;width:100%');
		modalNode.appendChild(modalContent);
		
		$(modalNode).dialog({
			modal:true
		});
	}
});