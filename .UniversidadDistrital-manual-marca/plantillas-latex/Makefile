.PHONY: ejemplos revisar clean

AQUI := $(abspath .)

ejemplos:
	cd ejemplos && tectonic -Z search-path=$(AQUI) presentacion-ejemplo.tex
	cd ejemplos && tectonic -Z search-path=$(AQUI) informe-ejemplo.tex

# make revisar PDF=ruta/a/presentacion.pdf
revisar:
	uv run --no-project --with pymupdf python revisar_pdf.py $(or $(PDF),ejemplos/presentacion-ejemplo.pdf)

clean:
	rm -f ejemplos/*.pdf
