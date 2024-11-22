# Assembly naming scheme

We use the following naming scheme for assembly ID:

``` plain text
[4 letters for breed] _ [count of that breed] _ [Animal ID]
```

The breed code tries to use the first four letters of a single-word breed, or 
the first two letters of the first two words for multi-word breeds.
This is not always that useful or consistent with previous approaches.

We then use the count of that breed (i.e. the first Hereford or the third 
Simmental) according to the order in the frozen dataset.

Finally we use the "animal ID", which is based on the md5sum of the sorted 
assembly names.
For primary/collapsed assemblies, this is just the filename.
For trio/HiC/dual assemblies, this is for both filenames.
Each F1 animal should then have the same "animal ID" across both haplotypes.
 
## Assembly preparation

Assemblies were mapped to ARS-UCD2.0 for consistent naming and orientation.
In the common case that chromosomes were not T2T, we collected all the contig 
pieces mapping to each chromosome and numbered them in the order that they 
aligned to that chromosome.

## Contig naming scheme

All 
Based on the [panSN](https://github.com/pangenome/PanSN-spec) scheme, where we 
have:

``` plain text
[sample_name] # [haplotype_id] # [scaffold_name] _ [contig piece counting from 0]
```

Such that the 3rd contig piece chromosome 15 of sample HERE would have the fasta
header

``` plain text
>HERE#0#15_0  
TTAGGG...
```
